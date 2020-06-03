import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
//import {LeafletMouseEvent} from 'leaflet'
import { 
    Map, 
    TileLayer, 
    Marker, 
    Popup,

 } from 'react-leaflet'
import axios from 'axios'

import api from '../../services/api'

import './styles.css'
import logo from '../../assets/logo.svg'


const CreatePoint = () => {
    const [items, setItems] = useState([])
    const [ufs, setUfs] = useState([])
    const [cities, setCities] = useState([])
    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [initialPosition, setInitialPosition] = useState([0,0])
    const [selectedPosition, setSelectedPosition] = useState()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            const {latitude, longitude} = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [items])

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla)
                console.log(ufInitials)
                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        if (selectedUf === "0") {
            return
        }

        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const citiesNames = response.data.map(city => city.nome)
                setCities(citiesNames)
            })

    }, [selectedUf])

    const onSelectUFHandler = (event) => {
        const uf = event.target.value
        console.log(uf)
        setSelectedUf(uf)
    }

    const onSelectCityHandler = (event) => {
        const city = event.target.value
        console.log(city)
        setSelectedCity(city)
    }

    const onClickMapHandler = (event) => {
        console.log(event.latlng)
        setSelectedPosition([event.latlng.lat,event.latlng.lng ])
    }
    return (
        <div id='page-create-point'>
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft /> Voltar para home
                </Link>
            </header>
            <form>
                <h1>Cadastro do ponto de coleta</h1>

                <fieldset>
                    <legend><h2>Dados</h2></legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map
                        center={initialPosition}
                        zoom={15}
                        onClick={onClickMapHandler}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition ? selectedPosition : initialPosition} />
                    </Map>

                    <div class="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>

                            <select
                                name="uf"
                                id="uf"
                                onChange={onSelectUFHandler}
                                value={selectedUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}

                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                value={selectedCity}
                                name="city"
                                id="city"
                                onChange={onSelectCityHandler} >

                                <option value="">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Items de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">

                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        )
                        )
                        }


                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    )
}

export default CreatePoint