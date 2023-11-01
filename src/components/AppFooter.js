import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <center>Dashboard</center>
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
