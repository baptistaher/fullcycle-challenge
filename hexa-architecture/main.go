/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package main

import "github.com/bosshentai/fullcycle-challenge/hexa-architecture/cmd"

func main() {
	cmd.Execute()
}

// package testing

// import (
// 	"database/sql"

// 	db2 "github.com/bosshentai/fullcycle-challenge/hexa-arquitecture/adapters/db"
// 	"github.com/bosshentai/fullcycle-challenge/hexa-arquitecture/application"
// 	_ "github.com/mattn/go-sqlite3"
// )

// func main() {
// 	db, _ := sql.Open("sqlite3", "db.sqlite")

// 	productDbAdapter := db2.NewProductDb(db)

// 	productService := application.NewProductService(productDbAdapter)
// 	product, _ := productService.Create("Product Exemple", 30)

// 	productService.Enable(product)

// }
