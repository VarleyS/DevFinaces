const Modal = {
    open() {
        //Abrir modal
        //Adicionar a class active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close() {
        //Fechar Modal
        // remover a class active do Modal
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

//preciso somar as entradas
//depois somar as saidas
//remover das entradas o valor das saídas
// assim, eu terei o total

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions"))
        || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", 
        JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    income() {
        let income = 0;
        //pegar todas as transações
        //para cada transação

        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount > 0 ) {
                //somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }
        })
        return income;
        //somar entradas
    },

    expense() {
        
        let expense = 0;
        //pegar todas as transações
        //para cada transação

        Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount < 0 ) {
                //somar a uma variavel e retornar a variavel
                expense += transaction.amount;
            }
        })
        return expense;
        // somar saidas
    },

    total() {
        return Transaction.income() + Transaction.expense();
        //entradas - saídas
    }
}

//Eu preciso pegar as informações do meu o
//objeto aqui no javascript
// e colocar lá no HTML

const DOM = {

    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.ineerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionContainer.appendChild(tr)
    },

    ineerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.income())

            document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expense())

            document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransaction() {
        DOM.transactionContainer.innerHTML = ""
    }
}


// Realiza a fprmatação dos valores, adicionando o sinal de + ou -
// Realiza um replace dos valores, transformando-os em string
// Transforma os valores do string em número e divide por 100
// Adiciona a formatação do toLocaleString colocando como padrão pt-BR
// retorna as formatações feitas em signal e value
const Utils = {
    formatAmount(value) {
        value = Number(value) * 100


        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100
        
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    //realizando os links com o html
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //toda vez que acessar o getValues, estarei recebendo
    //um objeto com os valores
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()

        if( description.trim() === "" || 
        amount.trim() === "" || 
        date.trim() === ""){
            throw new Error("Por favor, preemncha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    saveTransaction() {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            //verificar se todas as informações foram preenchidas
            Form.validateFields()
            //formatar os dados para Salvar
            const transaction = Form.formatValues()
            //salvar
            Transaction.add(transaction)
            //apagar os dados do formulario
            Form.clearFields()
            //fechar modal
            Modal.close()
        }catch(error) {
            alert(error.message)
        }


        
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)

    },
    reload() {
        DOM.clearTransaction()
        App.init()
    }
}

App.init()