# Desafio FullCycle - Arquitetura Orientada a Eventos(EDA)

Este projeto contém microsserviços desenvolvidos para praticar conceitos de Event-Driven Architecture (EDA):

- **walletcore** (Golang)
- **balancecore** (Nestks/TypeScrip)

Para facilitar a execução local, o projeto utiliza **Docker Compose**, responsável por subir todos os serviços necessarios.

---

## Serviços executardos pelo Docker Compose

O ambiente inclui os seguintes serviços:

- **Zookeeper**
- **Kafka**
- **Control Center** (Confluent)
- **MySQL**
- **walletcore** (Golang)
- **balancecore** (Nestjs/TypeScript )

---

## Como executar o projeto

1. Pré-requisitos
Certifique-se de qie possui o **Docker** e o **Docker Compose** instalados na sua maquina.
2. Inicializar o ambiente
Depois, execute:

  ```sh
docker compose up -d --build
  ```

O comando irá:

- Construir as imagens necessárias
- Subir todos os containers
- Executar automaticamente as migrações de BD para **walletcore** e **balancecore**

---

## Testando os microsserviços

Após todos os serviços estarem ativos, você pode utilizar o arquivo client.http para executar requisições e validar o comportamento dos dois microsserviços.

---

## Possíveis problemas (Linux)

Se um dos microsserviços não iniciar corretamente devido a permissões no script de entrada, execute:

```sh
chmod +x ./balancecore/entrypoint/entrypoint.sh
chmod +x ./walletcore/entrypoint/entrypoint.sh

```

---

### Observações

- Por enquanto, o projeto não utiliza variaveis de ambiente, mas essas serão adicionadas futuramente
- Certifique-se de que nenhuma porta necessaria já está sendo usada no sistema.
