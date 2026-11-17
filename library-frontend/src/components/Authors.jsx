import { useMutation, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, SET_YEAR } from '../queries'
import { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")
  const { data, loading, error } = useQuery(ALL_AUTHORS)
  const [ setBornYear ] = useMutation(SET_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const token = props.token

  if (!props.show) {
    return null
  }
  if (loading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const authors = data.allAuthors

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      await setBornYear({ variables: { name, born: Number(born) } })
      setName("")
      setBorn("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="name">name</label>
              <select
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              >
                <option value="">Select author</option>
                {authors.map(author => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born">born</label>
              <input
                id="born"
                type="number"
                value={born}
                onChange={(e) => setBorn(e.target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors
