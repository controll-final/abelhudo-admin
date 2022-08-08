import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'
import './styles.global.css'
import { AuthStorage } from './context/authContext'

import { ProductStorage } from './context/productContext'
import ProductsTable from './components/ProductsTable'

const Abelhudo: FC = () => {

  return (
    <AuthStorage>
      <ProductStorage>
        <Layout
          pageHeader={
            <PageHeader
              title={<FormattedMessage id="abelhudo.title" />}
            />
          }
        >
          <PageBlock variation="full">
            <ProductsTable />
          </PageBlock>
        </Layout>
      </ProductStorage>
    </AuthStorage>
  )
}

export default Abelhudo
