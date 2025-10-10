
import React, { useState, useEffect } from 'react';
import { Box, BasePropertyProps, Label } from '@adminjs/design-system'
import { ApiClient } from 'adminjs';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, record } = props
  const api = new ApiClient();
  const [data, setData] = useState([]);
  const url = window.location.href;

  const getXarak = async (page = 1) => {
    const pqr = {
      perPage: 50,
      page,
    }
    if (url.includes('goods')) {
      pqr['filters.goods_id'] = record.id
    } else {
      pqr['filters.transport_id'] = record.id
    }
    await api
      .resourceAction({
        resourceId: url.includes('goods') ? 'goods_cars' : 'transport_cars',
        actionName: 'list',
        params: pqr
      })
      .then((dat) => {
        const chars = dat?.data?.records?.map((el) => el.populated.type_car_id.params.ru).join(', ') || '';
        setData(chars);
      });
  };

  useEffect(() => {
    getXarak();
  }, [record]);

  return (
    <Box marginBottom="xxl" mt={30}>
      <Label>Тип машины</Label>
      {data}
    </Box>
  )
}

export default Edit