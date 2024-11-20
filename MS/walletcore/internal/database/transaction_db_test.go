package database

import (
	"database/sql"
	"testing"

	"github.com/bosshentai/fullcycle-challenge/MS/walletcore/internal/entity"
	"github.com/stretchr/testify/suite"
)

type TransactionDBTestSuite struct {
	suite.Suite
	db            *sql.DB
	client        *entity.Client
	client2       *entity.Client
	accoutFrom    *entity.Account
	accoutTo      *entity.Account
	transactionDB *TransactionDB
}

func (suite *TransactionDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	suite.Nil(err)
	suite.db = db
	db.Exec(
		"Create table clients (id varchar(255), name varchar(255), email varchar(255), created_at datetime, updated_at datetime)",
	)
	db.Exec(
		"Create table accounts (id varchar(255), client_id varchar(255), balance float, created_at datetime, updated_at datetime)",
	)
	db.Exec(
		"Create table transactions (id varchar(255), account_from_id varchar(255), account_to_id varchar(255), amount float, created_at datetime)",
	)

	client, err := entity.NewClient("John", "j@j.com")
	suite.Nil(err)
	suite.client = client

	client2, err := entity.NewClient("Jane", "j@j.com")
	suite.Nil(err)
	suite.client2 = client2

	// creating accounts
	accountFrom := entity.NewAccount(suite.client)
	accountFrom.Balance = 1000
	suite.accoutFrom = accountFrom

	accountTo := entity.NewAccount(suite.client2)
	accountTo.Balance = 1000
	suite.accoutTo = accountTo

	suite.transactionDB = NewTransactionDB(db)
}

func TestTransactionDBTestSuite(t *testing.T) {
	suite.Run(t, new(TransactionDBTestSuite))
}

func (suite *TransactionDBTestSuite) TearDownSuite() {
	defer suite.db.Close()
	suite.db.Exec("DROP TABLE clients")
	suite.db.Exec("DROP TABLE accounts")
	suite.db.Exec("DROP TABLE transactions")
}

func (suite *TransactionDBTestSuite) TestCreate() {
	transaction, err := entity.NewTransaction(suite.accoutFrom, suite.accoutTo, 100)

	suite.Nil(err)

	err = suite.transactionDB.Create(transaction)
	suite.Nil(err)
}
