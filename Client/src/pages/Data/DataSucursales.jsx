import { useContext } from 'react'
import { SucursalTable } from '../../components/Data/SucursalesData.jsx'
import { UserContext } from '../../context/UserContext.jsx'

const Sucursales = () => {
    const user = useContext(UserContext)
    return (
        <>
            <div>
                {user && (user.id === 3 || user.id === 4) && (
                    <SucursalTable />
                )}
            </div>
        </>
    )
}

export default Sucursales;