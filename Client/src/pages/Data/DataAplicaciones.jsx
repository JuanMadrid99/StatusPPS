import { useContext } from 'react'
import { AplicacionTable } from '../../components/Data/AplicacionesData.jsx'
import { UserContext } from '../../context/UserContext.jsx'

const Aplicaciones = () => {
    const user = useContext(UserContext)
    return (
        <>
            <div>
                {user &&(user.id === 3 || user.id === 4) && (
                    <AplicacionTable />
                )}
            </div>
        </>
    )
}

export default Aplicaciones;