import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Pessoa from '../pages/Pessoa/Pessoa'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Pessoa />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
