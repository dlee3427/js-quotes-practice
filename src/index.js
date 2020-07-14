document.addEventListener("DOMContentLoaded", () =>{
    const quoteList = document.getElementById("quote-list")
    const quoteForm = document.getElementById("new-quote-form")

    const sortBtn = document.createElement("button")
    sortBtn.className = "btn-primary"

    function fetchQuotes() {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp => resp.json())
        .then(newQuotes => {
            newQuotes.forEach(quote => addQuotes(quote))
        })
    }

    fetchQuotes() 

    function addQuotes(text) {
        const li = document.createElement("li")
        li.className = "quote-card"

        const blockquote = document.createElement("blockquote")
        blockquote.className = "blockquote-footer"

        const p = document.createElement("p")
        p.className = "mb-0"
        p.innerText = text.quote

        const footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = text.author

        const br = document.createElement("br")

        const deleteBtn = document.createElement("button")
        deleteBtn.innerText = "Delete Quote"
        deleteBtn.addEventListener("click", () => {
            fetch("http://localhost:3000/quotes/"+text.id, {
                method: "DELETE"
            })
            .then(() => li.remove())
        })

        const likeBtn = document.createElement("button")
        likeBtn.innerText = "Likes: "
        const span = document.createElement("span")
        if (text.likes) {
            span.innerText = text.likes.length
        } else {
            span.innerText = 0
        }
        likeBtn.append(span)

        likeBtn.addEventListener("click", () => {
            fetch("http://localhost:3000/likes", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    quoteId: text.id
                })
            })
            .then(resp => resp.json())
            .then( () => {
                let likes = parseInt(span.innerText)
                span.innerText = ++likes
            })
        })
        blockquote.append(p, footer, br, deleteBtn, likeBtn)
        li.append(blockquote)
        quoteList.append(li)
    }

    quoteForm.addEventListener("submit", () => {
        event.preventDefault()
        fetch("http://localhost:3000/quotes", { 
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quote: event.target[0].value,
                author: event.target[1].value
            })
        })
        .then(resp => resp.json())
        .then(newQuote => {
            addQuotes(newQuote)
            quoteForm.reset()
        })
    })

})