package gateway

import "github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}
