package handler

import (
	"fmt"
	"os"
	"sync"

	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/events"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/kafka"
)

type UpdateBalanceKafkaHandler struct {
	kafka *kafka.Producer
}

func NewBalanceUpdatedKafkaHandler(kafka *kafka.Producer) *UpdateBalanceKafkaHandler {
	return &UpdateBalanceKafkaHandler{
		kafka: kafka,
	}
}

func (h *UpdateBalanceKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()
	h.kafka.Publish(message, nil, "balances")
	fmt.Fprintf(os.Stdout, "[UpdateBalanceKafkaHandler] Balance updated: %v\n", message.GetPayload())
}
