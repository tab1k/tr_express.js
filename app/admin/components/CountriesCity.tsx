import React, { useState, useEffect } from 'react';
import { Box, H3, Button, Icon, Text, Table, TableBody, TableCell, Pagination, PaginationProps, TableHead, TableRow } from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';
import { ApiClient } from 'adminjs';

const sectionsStep = (props: BasePropertyProps) => {
  const { record } = props;
  const api = new ApiClient();

  const params = record.params

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = { search: ''}

  const getXarak = async (page = 1) => {
    await api
      .resourceAction({
        resourceId: 'cities',
        actionName: 'list',
        params: {
          'filters.country_id': record.id,
          perPage: 50,
          page,
        },
      })
      .then((dat) => {
        const chars = dat?.data?.records?.map((el) => ({
          id: el.id,
          title: el.params?.ru,
          position: el.params?.position,
          country_id: el.params.country_id,
        }));
        setData(chars);
        setCurrentPage(dat?.data?.meta?.page || 1);
        setTotalPages(dat?.data?.meta?.total || 1);
      });
  };

  useEffect(() => {
    getXarak(currentPage);
  }, [record]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getXarak(page);
  };

  const deleteRow = (id) => {
    const isConfirmed = confirm('Вы точно хотите удалить запись?');
    if (isConfirmed) {
      api
        .resourceAction({
          resourceId: 'cities',
          url: `/api/resources/cities/records/${id}/delete`,
          actionName: 'delete',
          method: 'get',
        })
        .then(() => getXarak(currentPage))
        .catch((error) => console.error('Error deleting row:', error));
    }
  };

  return (
    <Box flex flexDirection={'column'} style={{ gap: '20px' }}>
      <Box variant="white" width={1} boxShadow="card">
        <Box flex>
          <Box flexGrow={1}>
            <H3>Города</H3>
          </Box>
          <Text textAlign="center">
            <a href={"/resources/cities/actions/new?country_id="+params.id}>
              <Button size="md" ml="md" variant="secondary">
                <Icon icon="Add" />
                Добавить город
              </Button>
              </a>
          </Text>
        </Box>
        <Box flex flexDirection={'column'} style={{ gap: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Позиция</TableCell>
                <TableCell>Действие</TableCell>
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
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title || ''}</TableCell>
                  <TableCell>{item.position || ''}</TableCell>
                  <TableCell>
                    <Box>
                      <a href={`/resources/cities/records/${item.id}/edit?&country_id=${record.id}`}>
                        <Button size="icon" rounded mr="lg">
                          <Icon icon="Edit" />
                        </Button>
                      </a>
                      <Button size="icon" variant="danger" rounded mr="lg" onClick={() => deleteRow(item.id)}>
                        <Icon icon="TrashCan" />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box flex justifyContent="center" mt="xl">
          <Pagination
              total={totalPages}
              page={currentPage}
              perPage={50}
              location={location}
              onChange={(item) => handlePageChange(item)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default sectionsStep;