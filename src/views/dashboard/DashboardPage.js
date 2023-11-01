import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../../config.js'
import {
  CCard,
  CCol,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CProgress,
  CRow,
  CCardBody,
  CButton,
  CButtonGroup,
  CCardHeader,
  CPagination,
  CPaginationItem,
  CTableFoot,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import WidgetsBrand from '../widgets/WidgetsBrand'
import ReactPaginate from 'react-paginate'

const DashboardPage = () => {
  const [commandes, setCommandes] = useState([])
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get(config.commandeApi)
        .then((response) => {
          console.log(response.data)
          setCommandes(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }, 5000) // 5000 milliseconds = 5 seconds
    return () => clearInterval(intervalId)
  }, [])
  const [selectedValue, setSelectedValue] = useState('Day')
  //monthly data
  const calculateTotalOrdersByMonth = commandes.reduce((acc, curr) => {
    const month = curr.date_creation.slice(0, 7)
    if (!acc[month]) {
      acc[month] = 0
    }
    acc[month] += 1
    return acc
  }, {})
  //Daily data
  const calculateTotalOrdersByDay = commandes.reduce((acc, curr) => {
    const date = curr.date_creation
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] = acc[date] + 1
    return acc
    console.log(acc)
  }, {})
  //data by Canal
  const calculateTotalOrdersByCanal = commandes.reduce((acc, curr) => {
    const date = curr.date_creation
    const orderType = curr.ligne_canal
    if (!acc[date]) {
      acc[date] = { POSD: 0, POSI: 0, CRC: 0, TLV: 0 }
    }
    acc[date][orderType]++
    return acc
  }, {})
  //Top boutiques calculer le nombre de ventes pour chaque boutique
  const calculateTotalOrdersByBoutique = commandes.reduce((acc, curr) => {
    const boutiques = curr.boutique
    const ville = curr.ville
    if (!acc[boutiques]) {
      acc[boutiques] = 0
    }
    acc[boutiques]++
    return acc
  }, {})
  //Calculer le pourcentage
  const totalOrders = Object.values(calculateTotalOrdersByBoutique).reduce(
    (acc, curr) => acc + curr,
    0,
  )
  //trier les boutique
  const boutiques = Object.keys(calculateTotalOrdersByBoutique).map((boutique) => {
    const pourcentage = (calculateTotalOrdersByBoutique[boutique] / totalOrders) * 100
    return {
      nom: boutique,
      ville: commandes.find((commande) => commande.boutique === boutique).ville,
      ventes: calculateTotalOrdersByBoutique[boutique],
      pourcentage: pourcentage.toFixed(2),
    }
  })
  boutiques.sort((a, b) => b.ventes - a.ventes)
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [btqsPerPage] = useState(5)
  // ...
  const indexOfLastBtq = currentPage * btqsPerPage
  const indexOfFirstBtq = indexOfLastBtq - btqsPerPage
  const currentBtqs = boutiques.slice(indexOfFirstBtq, indexOfLastBtq)
  console.log(`Loading items from ${indexOfLastBtq} to ${indexOfFirstBtq}`)
  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1)
  }
  return (
    <>
      <h6>Production journaliére par Canal</h6>
      <WidgetsBrand withCharts />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Usage CCU
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Canal'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={selectedValue === value}
                    onClick={() => setSelectedValue(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          {selectedValue === 'Day' && (
            <CChart
              type="bar"
              data={{
                labels: Object.keys(calculateTotalOrdersByDay),
                datasets: [
                  {
                    label: 'Totale de commandes ',
                    backgroundColor: '#f87979',
                    data: Object.values(calculateTotalOrdersByDay),
                  },
                ],
              }}
              labels="months"
            />
          )}
          {selectedValue === 'Month' && (
            <CChart
              type="bar"
              data={{
                labels: Object.keys(calculateTotalOrdersByMonth),
                datasets: [
                  {
                    label: 'Totale des commandes par mois ',
                    backgroundColor: '#f87979',
                    data: Object.values(calculateTotalOrdersByMonth),
                  },
                ],
              }}
              labels="months"
            />
          )}
          {selectedValue === 'Canal' && (
            <CChart
              type="bar"
              data={{
                labels: Object.keys(calculateTotalOrdersByCanal),
                datasets: [
                  {
                    label: 'POSD',
                    backgroundColor: '#4f5d73',
                    data: Object.values(calculateTotalOrdersByCanal).map((data) => data.POSD),
                  },
                  {
                    label: 'POSI',
                    backgroundColor: '#9da5b1',
                    data: Object.values(calculateTotalOrdersByCanal).map((data) => data.POSI),
                  },
                  {
                    label: 'CRC',
                    backgroundColor: '#3399ff',
                    data: Object.values(calculateTotalOrdersByCanal).map((data) => data.CRC),
                  },
                  {
                    label: 'TLV',
                    backgroundColor: '#f87979',
                    data: Object.values(calculateTotalOrdersByCanal).map((data) => data.TLV),
                  },
                ],
              }}
              labels="canal"
            />
          )}
        </CCardBody>
      </CCard>
      <h6 className="m-2">Top boutiques</h6>
      <CCard className="mb-4">
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Boutique</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Ville</CTableHeaderCell>
              <CTableHeaderCell>Usage</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          {currentBtqs.map((btq, curr) => {
            return (
              <CTableBody key={curr}>
                <CTableRow v-for="item in tableItems" key={curr}>
                  <CTableDataCell>
                    <div>{btq.nom}</div>
                    <div className="small text-medium-emphasis">
                      Nombres de ventes | <span>{btq.ventes}</span>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <div>{btq.ville}</div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="clearfix">
                      <div className="float-start">
                        <strong>{btq.pourcentage} %</strong>
                      </div>
                      <div className="float-end">
                        <small className="text-medium-emphasis"></small>
                      </div>
                    </div>
                    <CProgress thin color="success" value={`${btq.pourcentage}`} />
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            )
          })}
          <ReactPaginate
            align="center"
            onPageChange={paginate}
            pageCount={Math.ceil(boutiques.length / btqsPerPage)}
            previousLabel={'Prev'}
            nextLabel={'Next'}
            containerClassName={'pagination'}
            pageLinkClassName={'page-number'}
            previousLinkClassName={'page-number'}
            nextLinkClassName={'page-number'}
            activeLinkClassName={'active'}
          />
        </CTable>
      </CCard>
    </>
  )
}

export default DashboardPage
