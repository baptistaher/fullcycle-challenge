package gateway

import "github.com/bosshentai/fullcycle-challenge/MS/walletcore/internal/entity"

type AccountGateway interface {
	Save(account *entity.Account) error
	FindByID(id string) (*entity.Account, error)
}
