package create_transaction

import (
	"context"
	"testing"

	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/entity"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/event"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/usecase/mocks"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/events"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// unit test
func TestCreateTransactionUseCase_Execute(t *testing.T) {
	client1, _ := entity.NewClient("client1", "j@j.com")
	account1 := entity.NewAccount(client1)
	account1.Credit(1000)

	client2, _ := entity.NewClient("client2", "m@m.com")
	account2 := entity.NewAccount(client2)
	account2.Credit(1000)

	mockUow := &mocks.UowMock{}
	mockUow.On("Do", mock.Anything, mock.Anything).Return(nil)

	// mockAccount := &AccountGatewayMock{}
	// mockAccount.On("FindByID", mock.Anything).Return(account1, nil)
	// mockAccount.On("FindByID", mock.Anything).Return(account2, nil)

	// mockTransaction := &TransactionGatewayMock{}
	// mockTransaction.On("Create", mock.Anything).Return(nil)

	inputDto := CreateTransactionInputDTO{
		AccountIDFrom: account1.ID,
		AccountIDTo:   account2.ID,
		Amount:        100,
	}

	dispatcher := events.NewEventDispatcher()
	event := event.NewTransactionCreated()
	ctx := context.Background()

	uc := NewCreateTransactionUseCase(mockUow, dispatcher, event)

	output, err := uc.Execute(ctx, inputDto)
	assert.Nil(t, err)
	assert.NotNil(t, output)
	mockUow.AssertExpectations(t)
	mockUow.AssertNumberOfCalls(t, "Do", 1)
	// mockAccount.AssertExpectations(t)
	// mockTransaction.AssertExpectations(t)
	// mockAccount.AssertNumberOfCalls(t, "FindByID", 2)
	// mockTransaction.AssertNumberOfCalls(t, "Create", 1)

}
