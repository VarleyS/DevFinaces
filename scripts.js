const Modal = {
    open() {
        //Abrir modal
        //Adicionar a class active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .toggle('active')
    },
    close() {
        //Fechar Modal
        // remover a class active do Modal
        document
        .querySelector('.modal-overlay')
        .classList
        .toggle('active')
    }
}

//preciso somar as entradas
//depois somar as saidas
//remover das entradas o valor das saídas
// assim, eu terei o total


const Transaction = {
    all: [{
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',    
    }, 
    {
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
    }, 
    {
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021',
    },
    {
        description: 'App',
        amount: 200000,
        date: '23/01/2021',
    }],

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
        tr.innerHTML = DOM.ineerHTMLTransaction(transaction)

        DOM.transactionContainer.appendChild(tr)
        

    },
    ineerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover Transação">
            </td>
        </tr>
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
    
}

const App = {
    init() {
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()

    },
    reload() {
        DOM.clearTransaction()
        App.init()
    }
}

App.init()