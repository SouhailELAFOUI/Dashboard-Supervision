import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CWidgetStatsD, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { CChart, CChartPie } from '@coreui/react-chartjs'
import axios from 'axios'
import config from '../../config'

const WidgetsBrand = ({ withCharts }) => {
  const [salebyCanal, setSalebyCanal] = useState([])
  const [basketByCanal, setBasketByCanal] = useState([])
  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get(config.saleByCanalApi)
        .then((response) => {
          console.log(response.data)
          setSalebyCanal(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
      axios
        .get(config.saleByBasketApi)
        .then((response) => {
          setBasketByCanal(response.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }, 5000) // 5000 milliseconds = 5 seconds
    return () => clearInterval(intervalId)
  }, [])
  const chartOptions = {
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  }
  const saleTypePOSD = salebyCanal.filter((sale) => sale.Canal === 'POSD')
  const posdTotal = saleTypePOSD.reduce((sum, sale) => sum + sale.total, 0)
  const saleTypePOSI = salebyCanal.filter((sale) => sale.Canal === 'POSI')
  const posiTotal = saleTypePOSI.reduce((sum, sale) => sum + sale.total, 0)
  const saleTypeCRC = salebyCanal.filter((sale) => sale.Canal === 'CRC')
  const crcTotal = saleTypeCRC.reduce((sum, sale) => sum + sale.total, 0)
  const saleTypeTLV = salebyCanal.filter((sale) => sale.Canal === 'TLV')
  const tlvTotal = saleTypeTLV.reduce((sum, sale) => sum + sale.total, 0)
  //get the number of basket of each Canal
  const getNbBasketByCanal = (canal) => {
    const result = basketByCanal.find((basket) => basket.Canal === canal)
    return result ? result.nb_panier : 0
  }
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          placeholder="posd"
          className="mb-4"
          icon={
            <h3 className="my-4 text-white" height={52}>
              POSD
            </h3>
          }
          values={[
            {
              title: 'commande',
              value: posdTotal !== null ? `${posdTotal} ` : 'N/A',
            },
            { title: 'panier', value: `${getNbBasketByCanal('POSD')}` },
          ]}
          style={{
            '--cui-card-cap-bg': '#3b5998',
          }}
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          className="mb-4"
          icon={
            <h3 className="my-4 text-white" height={52}>
              POSI
            </h3>
          }
          values={[
            {
              title: 'commande',
              value: posiTotal !== null ? `${posiTotal} ` : 'N/A',
            },
            { title: 'panier', value: `${getNbBasketByCanal('POSI')} ` },
          ]}
          style={{
            '--cui-card-cap-bg': '#00aced',
          }}
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          className="mb-4"
          icon={
            <h3 className="my-4 text-white" height={52}>
              CRC
            </h3>
          }
          values={[
            {
              title: 'commande',
              value: crcTotal !== null ? `${crcTotal}` : 'N/A',
            },
            { title: 'panier', value: `${getNbBasketByCanal('CRC')} ` },
          ]}
          style={{
            '--cui-card-cap-bg': '#4875b4',
          }}
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          className="mb-4"
          color="warning"
          icon={
            <h3 className="my-4 text-white" height={52}>
              TLV
            </h3>
          }
          values={[
            {
              title: 'commande',
              value: tlvTotal !== null ? `${tlvTotal} ` : 'N/A',
            },
            { title: 'panier', value: `${getNbBasketByCanal('TLV')} ` },
          ]}
        />
      </CCol>
      <CCol xs={5} className="mx-auto">
        <CCard className="mb-4">
          <CCardHeader>Part de la vente par Canal</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: ['POSD', 'POSI', 'CRC', 'TLV'],
                datasets: [
                  {
                    data: [`${posdTotal} `, `${posiTotal} `, `${crcTotal} `, `${tlvTotal} `],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FFAA33'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FFAA33'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

WidgetsBrand.propTypes = {
  withCharts: PropTypes.bool,
}

export default WidgetsBrand
