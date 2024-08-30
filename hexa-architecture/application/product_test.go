package application_test

import (
	"testing"

	"github.com/bosshentai/fullcycle-challenge/hexa-architecture/application"
	uuid "github.com/satori/go.uuid"
	"github.com/stretchr/testify/require"
)

func TestProduct_Enable(t *testing.T) {

	product := application.Product{}
	product.Name = "Hello"
	product.Price = 10
	product.Status = application.DISABLE

	err := product.Enable()

	require.NoError(t, err)

	product.Price = 0
	err = product.Enable()

	require.EqualError(t, err, "the price must be greater than zero to enable the product")

}

func TestProduct_Disable(t *testing.T) {

	product := application.Product{}
	product.Name = "Hello"
	product.Price = 0
	product.Status = application.ENABLE

	err := product.Disable()

	require.NoError(t, err)

	product.Price = 10
	err = product.Disable()

	require.EqualError(t, err, "the price must be zero in order to have the product disabled")
}

func TestProduct_IsValid(t *testing.T) {
	product := application.Product{}
	product.ID = uuid.NewV4().String()
	product.Name = "hello"
	product.Status = application.DISABLE
	product.Price = 10

	_, errr := product.IsValid()
	require.NoError(t, errr)

	product.Status = "INVALID"

	_, err := product.IsValid()
	require.Equal(t, "the status must be enabled or disabled", err.Error())

	product.Status = application.ENABLE
	_, err = product.IsValid()
	require.Nil(t, err)

	product.Price = -10
	_, err = product.IsValid()
	require.Equal(t, "the price must be greater or equal to zero", err.Error())
}

func TestProduct_GetName(t *testing.T) {

	product := application.Product{}
	product.Name = "Hello"

	name := product.GetName()
	require.Equal(t, "Hello", name)
}

func TestProduct_GetId(t *testing.T) {

	product := application.Product{}
	generated := uuid.NewV4().String()
	product.ID = generated

	id := product.GetId()
	require.Equal(t, generated, id)
}

func TestProduct_GetStatus(t *testing.T) {

	product := application.Product{}
	product.Status = "disabled"

	status := product.GetStatus()
	require.Equal(t, "disabled", status)

	product.Status = "enabled"
	status = product.GetStatus()
	require.Equal(t, "enabled", status)
}
