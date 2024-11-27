package main

import (
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {

	deliveryChannel := make(chan kafka.Event)

	producer := NewKafkaProducer()

	Publish("messaege", "teste", producer, []byte("transferencia"), deliveryChannel)
	go DeliveryReport(deliveryChannel) // async

	fmt.Println("Hello World")
	producer.Flush(5000)

	// sync
	// e := <-deliveryChannel

	// msg := e.(*kafka.Message)
	// if msg.TopicPartition.Error != nil {
	// 	fmt.Println("Erro ao enviar")
	// } else {
	// 	fmt.Println("Mensagem enviada", msg.TopicPartition)
	// }
	// producer.Flush(1000)
	// fmt.Println("Hello Go")
}

func NewKafkaProducer() *kafka.Producer {
	configMap := &kafka.ConfigMap{
		"bootstrap.servers":   "kafka-go-kafka-1:9092",
		"delivery.timeout.ms": "0",
		"acks":                "all",  // 0 , 1 or all
		"enable.idempotence":  "true", // default false
	}

	producer, err := kafka.NewProducer(configMap)
	if err != nil {
		log.Println(err.Error())
	}

	return producer

}

func Publish(msg string, topic string, producer *kafka.Producer, key []byte, deliveryChannel chan kafka.Event) error {
	message := &kafka.Message{
		Value: []byte(msg),
		TopicPartition: kafka.TopicPartition{
			Topic:     &topic,
			Partition: kafka.PartitionAny,
		},
		Key: key,
	}

	err := producer.Produce(message, deliveryChannel)
	if err != nil {
		log.Println(err.Error())
		return err
	}

	return err
}

func DeliveryReport(deliveryChan chan kafka.Event) {
	for e := range deliveryChan {
		switch ev := e.(type) {
		case *kafka.Message:
			if ev.TopicPartition.Error != nil {
				fmt.Println("Erro ao enviar")
			} else {
				fmt.Println("Mensagem enviada", ev.TopicPartition)
				// save in the database de message was process
				// ex: confirm a bank transaction was done.
			}
		}
	}
}
