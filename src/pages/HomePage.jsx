import Header from './Header';
import Footer from './Footer';
import '../styles/homePage.css';

export const HomePage = () => {

  return (
    <div className='app-container'>
      <Header />


      <img src="../images/cine1024.png" alt="Portada de Cine" className='imgcine' />

      <Footer />
    </div>
  );
};