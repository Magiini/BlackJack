import { useState } from 'react';
import './App.css';

function App() {
  const figura = ['♣', '♦', '♥', '♠'];
  const wartosc = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const talia = [];
  const [karty_gracza, setKartyGracza] = useState([]);
  const [karty_krupiera, setKartyKrupiera] = useState([]);
  const [wynik_gracza, setWynikGracza] = useState(0);
  const [wynik_krupiera, setWynikKrupiera] = useState(0);
  const [start, setStart] = useState(0);
  const [wynik_gry, setWynikGry] = useState('');
  const [saldo, setSaldo] = useState(100); 
  const [stawka, setStawka] = useState(0); 
  const [ukrytaKartaKrupiera, setUkrytaKartaKrupiera] = useState(true); 

  // Stworzenie talii
  for (let i = 0; i < wartosc.length; i++) {
    for (let j = 0; j < figura.length; j++) {
      talia.push(wartosc[i] + figura[j]);
    }
  }

  function Graj(e) {
    e.preventDefault();
    if (stawka <= 0 || stawka > saldo) {
      alert('Wprowadź prawidłową stawkę!');
      return;
    }

    setStart(1);
    setWynikGry('');
    setUkrytaKartaKrupiera(true); 

    // Rozdanie kart
    const noweKartyGracza = [];
    const noweKartyKrupiera = [];
    for (let i = 0; i < 2; i++) {
      noweKartyGracza.push(talia[Math.floor(Math.random() * talia.length)]);
      noweKartyKrupiera.push(talia[Math.floor(Math.random() * talia.length)]);
    }

    setKartyGracza(noweKartyGracza);
    setKartyKrupiera(noweKartyKrupiera);

    // Obliczanie wyników
    const wynikGracza = obliczWynik(noweKartyGracza);
    const wynikKrupiera = obliczWynik([noweKartyKrupiera[1]]); 
    setWynikGracza(wynikGracza);
    setWynikKrupiera(wynikKrupiera);
  }

  function Zostań(e) {
    e.preventDefault();
    setStart(0); 
    setUkrytaKartaKrupiera(false); 

    let aktualneKartyKrupiera = [...karty_krupiera];
    let aktualnyWynikKrupiera = obliczWynik(aktualneKartyKrupiera);

    while (aktualnyWynikKrupiera < 17) {
      const nowaKarta = talia[Math.floor(Math.random() * talia.length)];
      aktualneKartyKrupiera.push(nowaKarta);

      aktualnyWynikKrupiera = obliczWynik(aktualneKartyKrupiera);
    }

    setKartyKrupiera(aktualneKartyKrupiera);
    setWynikKrupiera(aktualnyWynikKrupiera);

    obliczWynikGry(wynik_gracza, aktualnyWynikKrupiera);
  }

  function dobierz(e) {
    e.preventDefault();

    const aktualneKartyGracza = [...karty_gracza];
    const nowaKarta = talia[Math.floor(Math.random() * talia.length)];
    aktualneKartyGracza.push(nowaKarta);

    const nowyWynikGracza = obliczWynik(aktualneKartyGracza);

    setKartyGracza(aktualneKartyGracza);
    setWynikGracza(nowyWynikGracza);

    if (nowyWynikGracza > 21) {
      setStart(0); 
      setWynikGry('Gracz przegrał'); 
      setSaldo(saldo - stawka);
    }
  }

  function obliczWynik(karty) {
    let wynik = 0;
    let liczbaAsow = 0;

    karty.forEach((karta) => {
      if (karta.includes('K') || karta.includes('Q') || karta.includes('J')) {
        wynik += 10;
      } else if (karta.includes('A')) {
        liczbaAsow += 1;
        wynik += 11; 
      } else {
        const numer = parseInt(karta.match(/^\d+/)?.[0], 10);
        if (!isNaN(numer)) {
          wynik += numer;
        }
      }
    });

    while (wynik > 21 && liczbaAsow > 0) {
      wynik -= 10; 
      liczbaAsow -= 1;
    }

    return wynik;
  }

  function obliczWynikGry(wynikGracza, wynikKrupiera) {
    if (wynikGracza > 21) {
      setWynikGry('Gracz przegrał');
      setSaldo(saldo - stawka); 
    } else if (wynikKrupiera > 21) {
      setWynikGry('Gracz wygrał');
      setSaldo(saldo + stawka); 
    } else if (wynikGracza > wynikKrupiera) {
      setWynikGry('Gracz wygrał');
      setSaldo(saldo + stawka);
    } else if (wynikGracza < wynikKrupiera) {
      setWynikGry('Gracz przegrał');
      setSaldo(saldo - stawka);
    } else {
      setWynikGry('Remis');
    }
  }

  function ustawStawke(kwota) {
    if (kwota === 'all') {
      setStawka(saldo); 
    } else {
      setStawka(stawka + kwota); 
    }
  }

  return (
    <>
      <h1>BLACKJACK</h1>
      <h2>{wynik_gry}</h2>
      <div class="reka">
        <h2>Ręka krupiera</h2>
          {karty_krupiera.map((karta, index) => (
            <p key={index}>
              {ukrytaKartaKrupiera && index === 0 ? '?' : karta}
            </p>
        ))}
        <p>Wynik krupiera: {ukrytaKartaKrupiera ? '?' : wynik_krupiera}</p>
      </div>

      <div class="reka">
        <h2>Twoja Ręka</h2>
          {karty_gracza.map((karta, index) => (
            <p key={index}>{karta}</p>
          ))}
      

        <p>Wynik gracza: {wynik_gracza}</p>
        <button onClick={dobierz} disabled={start === 0}>Dobierz</button>
        <button onClick={Zostań} disabled={start === 0}>Zostań</button>
      </div>

    <div class='reka'>
      <h2>Saldo: {saldo} zł</h2>
      <h3>Stawka: {stawka} zł</h3>
        
       
      <button onClick={() => ustawStawke(1)} disabled={start === 1 || saldo < 1}>1 zł</button>
      <button onClick={() => ustawStawke(5)} disabled={start === 1 || saldo < 5}>5 zł</button>
      <button onClick={() => ustawStawke(10)} disabled={start === 1 || saldo < 10}>10 zł</button>
      <button onClick={() => ustawStawke(100)} disabled={start === 1 || saldo < 100}>100 zł</button>
      <button onClick={() => ustawStawke('all')} disabled={start === 1 || saldo <= 0}>All In</button>
      <button id="zeruj" onClick={() => setStawka(0)} disabled={start === 1 || stawka === 0}>Zeruj</button>
      <button onClick={Graj} disabled={start === 1 || stawka <= 0} id='graj'>Graj</button>
    </div>
    
    </>
  );
}

export default App;
