import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const { data: dataAll, loading: loadingAll } = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const { data: genreData, loading: genreLoading } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  })

  if (!props.show) {
    return null
  }
  if (loadingAll || genreLoading) {
    return <div>loading...</div>
  }

  const allBooks = dataAll.allBooks

  const books = selectedGenre ? genreData?.allBooks ?? [] : dataAll?.allBooks ?? []

  const genres = [...new Set(allBooks.flatMap(b => b.genres))]

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && 
        <p>in genre <strong>{selectedGenre}</strong></p>
      }

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        {genres.map(genre => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClickCapture={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
