import React, { useEffect, useState } from 'react'
import { ApiClient } from 'adminjs'
import styled from 'styled-components'
import axios from 'axios'
import {
 Box,
 H2,
 H5,
 Icon,
 Text,
} from '@adminjs/design-system'

const pageHeaderHeight = 284
const pageHeaderPaddingY = 74
const pageHeaderPaddingX = 250

export const DashboardHeader: React.FC = () => {
 return (
  <Box position="relative" overflow="hidden" data-css="default-dashboard">
   <Box
    bg="grey100"
    height={pageHeaderHeight}
    py={pageHeaderPaddingY}
    px={['default', 'lg', pageHeaderPaddingX]}
   >
    <Text textAlign="center" color="white">
     <H2>Админ-панель Trucking Desk</H2>
     <Text opacity={0.8}>
      Админ-панель для Trucking Desk позволяет управлять настройками проекта, управление со всеми данными, удобный интерфейс для отслеживание и управление грузами.
     </Text>
    </Text>
   </Box>
  </Box>
 )
}

// @ts-ignore
const Card = styled(Box)`
  display: ${({ flex }): string => (flex ? 'flex' : 'block')};
  color: ${({ theme }): string => theme.colors.grey100};
  text-decoration: none;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${({ theme }): string => theme.colors.primary100};
    box-shadow: ${({ theme }): string => theme.shadows.cardHover};
  }
`

Card.defaultProps = {
 variant: 'white',
 boxShadow: 'card',
}

const clearCache = async () => {
  await axios.get('/api/cache-clear').then(res => {
    alert('Успешно!')
  }).catch(err => {
    alert(err)
  })
}

export const Dashboard: React.FC = () => {
 const [data, setData] = useState()
 const api = new ApiClient()
 useEffect(() => {
  api.getDashboard()
   .then((response) => {
    console.log(response.data);
    setData(response.data) // { message: 'Hello World' }
   })
   .catch((error) => {
    // handle any errors
   });
 }, []);
 return (
  <Box>
   <DashboardHeader />
   <Box
    mt={['xl', 'xl', 'xl']}
    mb="xl"
    mx={[0, 0, 0, 'auto']}
    px={['default', 'lg', 'xxl', '0']}
    position="relative"
    flex
    flexDirection="row"
    flexWrap="wrap"
    width={[1, 1, 1, 1024]}
   >
    <Box width={[1, 1 / 2]} p="lg">
      <Card className='h-100' as="a" flex href="/resources/projects">
      <Box ml="sm">
        <H5>Количество расчетов</H5>
        <Box flex alignItems={'center'}>
        <Icon size={24} icon={'Blog'}/>
        <Text fontSize={20} pl={5}>{data && data.blogs_count ? data.blogs_count : 0}</Text>
        </Box>
      </Box>
      </Card>
    </Box>
    <Box width={[1, 1 / 2]} p="lg">
      <Card className='h-100' as="a" flex href="/resources/blogs">
      <Box ml="sm">
        <H5>Количество заказов</H5>
        <Box flex alignItems={'center'}>
        <Icon size={24} icon={'Hotel'}/>
        <Text fontSize={20} pl={5}>{data && data.house_count ? data.house_count : 0}</Text>
        </Box>
      </Box>
      </Card>
    </Box>
    <Box width={[1]} p="lg">
      <Card className='h-100' as="a" flex href="/resources/requests">
        <Box ml="sm">
          <H5>Количество пользователей</H5>
          <Box flex alignItems={'center'}>
          <Icon size={24} icon={'UserMultiple'}/>
          <Text fontSize={20} pl={5}>{data && data.users_count ? data.users_count : 0}</Text>
          </Box>
        </Box>
      </Card>
    </Box>
   </Box>
  </Box>
 )
}


export default Dashboard