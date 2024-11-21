package gateway

import "github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/entity"

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}
