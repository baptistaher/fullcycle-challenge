package handler

import (
	"sync"

	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/events"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/kafka"
)

type TransactionCreatedKafkaHandler struct {
	kafka *kafka.Producer
}

func NewTransactionCreatedKafkaHandler(kafka *kafka.Producer) *TransactionCreatedKafkaHandler {
	return &TransactionCreatedKafkaHandler{
		kafka: kafka,
	}
}

func (h *TransactionCreatedKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()

	h.kafka.Publish(message, nil, "transactions")
	// fmt.Fprintf(os.Stdout, "[TransactionCreatedKafkaHandler] Transaction created: %v\n", message.GetPayload())
}
