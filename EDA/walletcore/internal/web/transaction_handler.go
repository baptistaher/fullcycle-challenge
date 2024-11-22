package web

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/usecase/create_transaction"
)

type WebTransactionHandler struct {
	CreateTransactionUseCase create_transaction.CreateTransactionUsecCase
}

func NewWebTransactionHandler(createTransaction create_transaction.CreateTransactionUsecCase) *WebTransactionHandler {
	return &WebTransactionHandler{
		CreateTransactionUseCase: createTransaction,
	}
}

func (handler *WebTransactionHandler) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	var dto create_transaction.CreateTransactionInputDTO

	err := json.NewDecoder(r.Body).Decode(&dto)

	if err != nil {
		log.Printf("BadRequest Error: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	output, err := handler.CreateTransactionUseCase.Execute(ctx, dto)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(output)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

}
