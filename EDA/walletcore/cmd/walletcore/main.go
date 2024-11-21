package main

import (
	"database/sql"
	"fmt"

	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/database"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/event"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/usecase/create_account"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/usecase/create_client"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/usecase/create_transaction"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/web"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/web/webserver"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/events"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local",
		"root",
		"root",
		"mysql",
		"3306",
		"wallet"))

	if err != nil {
		panic(err)
	}

	defer db.Close()

	eventDispatcher := events.NewEventDispatcher()
	transactionCreatedEvent := event.NewTransactionCreated()
	// eventDispatcher.Register("TransactionCreated", handler)

	clientDb := database.NewClientDB(db)

	accountDb := database.NewAccountDB(db)

	transactionDb := database.NewTransactionDB(db)

	createClientUseCase := create_client.NewCreateClientUseCase(clientDb)

	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDb, clientDb)

	createTransactionUseCase := create_transaction.NewCreateTransactionUseCase(transactionDb,
		accountDb,
		eventDispatcher,
		transactionCreatedEvent)

	webserver := webserver.NewWebServer(":3000")

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUseCase)

	webserver.AddHandler("/clients", clientHandler.CreateClient)

	webserver.AddHandler("/accounts", accountHandler.CreateAccount)

	webserver.AddHandler("/transactions", transactionHandler.CreateTransaction)

	fmt.Println("Server is running on port 3000")
	webserver.Start()

}
