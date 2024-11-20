package gateway

import "github.com/bosshentai/fullcycle-challenge/MS/walletcore/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}
