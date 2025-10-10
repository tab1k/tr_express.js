import React, { useState, useEffect } from 'react';
import { Box, H3, H6, Input, Button, Icon, Text, RichTextEditor, Table, TableBody, TableCell, TableHead, TableRow } from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';
import { ApiClient } from 'adminjs';

const sectionsStep = (props: BasePropertyProps) => {
  const { record } = props;
  const api = new ApiClient();
  const { search } = location;

  const params = record.params
  const [data, setData] = useState([]);
  const url = new URLSearchParams(search);
  const getXarak = async () => {
    await api.resourceAction({
      resourceId: 'goods_points',
      actionName: 'list',
      params: {
        'filters.goods_id': record.id,
        perPage: 10000
      }
    }).then(dat => {
      const chars = dat?.data?.records?.map(el => {
        return {
          id: el.id,
          city: el.populated?.city_id?.params?.ru,
          radius: el.populated?.radius_id?.params?.name,
          type: el.params?.type
        }
      })
      setData(chars)
    });
  };

  useEffect(() => {
    getXarak();
  }, [record]);


  return (
    <Box flex mb={20} className={'mbdo'} style={{ gap: '20px' }}>
      <Box variant="white" width={1/1} boxShadow="card" style={{padding: '16px 10px'}}>
        <Box flex>
          <Box flexGrow={1}>
            <H6>Пункты погрузки</H6>
          </Box>
        </Box>
        <Box flex flexDirection={'column'} style={{ gap: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Город</TableCell>
                <TableCell>Радиус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data.length && (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                    Нет записи
                  </TableCell>
                </TableRow>
              )}
              {data.length > 0 &&
                data.filter(els => els.type === 'loading').map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.city || ''}</TableCell>
                    <TableCell>{item.radius || ''}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
      <Box variant="white" width={1/1} boxShadow="card" style={{padding: '16px 10px'}}>
        <Box flex>
          <Box flexGrow={1}>
            <H6>Пункты разгрузки</H6>
          </Box>
        </Box>
        <Box flex flexDirection={'column'} style={{ gap: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Город</TableCell>
                <TableCell>Радиус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data.length && (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                    Нет записи
                  </TableCell>
                </TableRow>
              )}
              {data.length > 0 &&
                data.filter(els => els.type === 'unloading').map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.city || ''}</TableCell>
                    <TableCell>{item.radius || ''}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default sectionsStep;