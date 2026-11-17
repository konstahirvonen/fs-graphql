import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, BOOKS_BY_GENRE, ME } from '../queries'

const Recommendations = () => {

    const { data: dataMe, loading: loadingMe } = useQuery(ME)
    const { data: dataBooks, loading: loadingBooks } = useQuery(BOOKS_BY_GENRE, 
        {
            variables: {
                genre: dataMe?.me?.favoriteGenre
            },
            skip: !dataMe?.me
        }
    )

    if (loadingBooks || loadingMe) {
        return <div>loading...</div>
    }

    if (!dataBooks || !dataMe?.me) {
        return <div>No recommendations available</div>
    }
    
    const recommendations = dataBooks?.allBooks || []


    return (
        <div>
            <h2><strong>recommendations</strong></h2>
            <p>books in your favorite genre<strong>{dataMe.me.favoriteGenre}</strong></p>

            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {recommendations.map((a) => (
                    <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>{a.author.name}</td>
                    <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations