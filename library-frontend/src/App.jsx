import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client/react'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("library-user-token"))
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token && (
          <button onClick={() => setPage('add')}>add book</button>
        )}

        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}

        {token ? (
          <button onClick={onLogout}>logout</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        ) }

      </div>

      <Authors token={token} show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      
      {page === "recommend" && (
        <Recommendations show={page === "recommend"} />
      )}

      {page === "login" && (
        <div>
          <Notify errorMessage={errorMessage} />
          <h2>Login</h2>
          <LoginForm
            setToken={setToken}
            setError={notify}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  )
}

export default App
