package create_transaction

import (
	"context"

	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/entity"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/internal/gateway"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/events"
	"github.com/bosshentai/fullcycle-challenge/EDA/walletcore/pkg/uow"
)

type CreateTransactionInputDTO struct {
	AccountIDFrom string  `json:"account_id_from"`
	AccountIDTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type CreateTransactionOutputDTO struct {
	ID            string  `json:"id"`
	AccountIDFrom string  `json:"account_id_from"`
	AccountIDTo   string  `json:"account_id_to"`
	Amount        float64 `json:"amount"`
}

type BalanceUpdatedOutputDTO struct {
	AccountIDFrom        string  `json:"account_id_from"`
	AccountIDTo          string  `json:"account_id_to"`
	BalanceAccountIDFrom float64 `json:"balance_account_id_from"`
	BalanceAccountIDTo   float64 `json:"balance_acconut_id_to"`
}

type CreateTransactionUsecCase struct {
	Uow uow.UowInterface
	// TransactionGateway gateway.TransactionGateway
	// AccountGateway     gateway.AccountGateway
	EventDispatcher    events.EventDispatcherInterface
	TransactionCreated events.EventInterface
	BalanceUpdated     events.EventInterface
}

func NewCreateTransactionUseCase(
	Uow uow.UowInterface,
	//  gateway.TransactionGateway,
	// accountGateway gateway.AccountGateway,
	eventDispatcher events.EventDispatcherInterface,
	transactionCreated events.EventInterface,
	balanceUpdated events.EventInterface,
) *CreateTransactionUsecCase {
	return &CreateTransactionUsecCase{
		Uow: Uow,
		// TransactionGateway: transactionGateway,
		// AccountGateway:     accountGateway,
		EventDispatcher:    eventDispatcher,
		TransactionCreated: transactionCreated,
		BalanceUpdated:     balanceUpdated,
	}
}

func (uc *CreateTransactionUsecCase) Execute(ctx context.Context, input CreateTransactionInputDTO) (*CreateTransactionOutputDTO, error) {
	// accountFrom, err := uc.AccountGateway.FindByID(input.AccountIDFrom)
	// if err != nil {
	// 	return nil, err
	// }

	// accountTo, err := uc.AccountGateway.FindByID(input.AccountIDTo)
	// if err != nil {
	// 	return nil, err
	// }

	// transaction, err := entity.NewTransaction(accountFrom, accountTo, input.Amount)
	// if err != nil {
	// 	return nil, err
	// }

	// err = uc.AccountGateway.UpdateBalance(accountFrom)
	// if err != nil {
	// 	return nil, err
	// }

	// err = uc.AccountGateway.UpdateBalance(accountTo)
	// if err != nil {
	// 	return nil, err
	// }

	// err = uc.TransactionGateway.Create(transaction)

	// if err != nil {
	// 	return nil, err
	// }

	// output := &CreateTransactionOutputDTO{
	// 	ID: transaction.ID,
	// }

	output := &CreateTransactionOutputDTO{}
	balanceUpdateOutput := &BalanceUpdatedOutputDTO{}

	err := uc.Uow.Do(ctx, func(_ *uow.Uow) error {
		accountRepository := uc.getAccountRepository(ctx)
		transactionRepository := uc.getTransactionRepository(ctx)

		accountFrom, err := accountRepository.FindByID(input.AccountIDFrom)
		if err != nil {
			return err
		}

		accountTo, err := accountRepository.FindByID(input.AccountIDTo)
		if err != nil {
			return err
		}

		transaction, err := entity.NewTransaction(accountFrom, accountTo, input.Amount)
		if err != nil {
			return err
		}

		err = accountRepository.UpdateBalance(accountFrom)
		if err != nil {
			return err
		}

		err = accountRepository.UpdateBalance(accountTo)
		if err != nil {
			return err
		}

		err = transactionRepository.Create(transaction)

		if err != nil {
			return err
		}

		output.ID = transaction.ID
		output.AccountIDFrom = input.AccountIDFrom
		output.AccountIDTo = input.AccountIDTo
		output.Amount = input.Amount

		balanceUpdateOutput.AccountIDFrom = input.AccountIDFrom
		balanceUpdateOutput.AccountIDTo = input.AccountIDTo
		balanceUpdateOutput.BalanceAccountIDFrom = accountFrom.Balance
		balanceUpdateOutput.BalanceAccountIDTo = accountTo.Balance

		return nil

	})

	if err != nil {
		return nil, err
	}

	uc.TransactionCreated.SetPayload(output)
	uc.EventDispatcher.Dispatch(uc.TransactionCreated)

	uc.BalanceUpdated.SetPayload(balanceUpdateOutput)
	uc.EventDispatcher.Dispatch(uc.BalanceUpdated)

	return output, nil
}

func (uc *CreateTransactionUsecCase) getAccountRepository(ctx context.Context) gateway.AccountGateway {

	repo, err := uc.Uow.GetRepositroy(ctx, "AccountDB")

	if err != nil {
		panic(err)
	}

	return repo.(gateway.AccountGateway)
}

func (uc *CreateTransactionUsecCase) getTransactionRepository(ctx context.Context) gateway.TransactionGateway {

	repo, err := uc.Uow.GetRepositroy(ctx, "TransactionDB")

	if err != nil {
		panic(err)
	}

	return repo.(gateway.TransactionGateway)
}
