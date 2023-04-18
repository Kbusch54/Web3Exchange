'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { margin } from '@mui/system';

const columns: GridColDef[] = [

    {
        field: 'asset',
        headerName: 'Asset',
        maxWidth: 250,
        sortable: false,
        hideable: true,
        minWidth:10,
    },
    {
        field: 'side',
        headerName: 'Side',
        type: 'number',
        maxWidth: 250,
        width: 90,
        minWidth:20,
    },
    {
        field: 'size',
        headerName: 'Position Size',
        type: 'number',
        maxWidth: 250,
        width: 90,
        minWidth:20,
    },
    {
        field: 'lev',
        headerName: 'Leverage',
        type: 'number',
        maxWidth: 250,
        width: 90,
        minWidth:20,
        valueFormatter: (params) =>
            `${(params.value, `${params.value}X`) || ''}`,

    },
    {
        field: 'pnl',
        headerName: 'PNL',
        maxWidth: 350,
        width: 90,
        minWidth:20,
        valueFormatter: (params) =>
            `${(params.value, `$${params.value}`) || ''}`,

    }

];

const rows = [
    { id: 1, side: 1, asset: 'TSLA', size: 3.5, lev: '10', pnl: '200.47' },
    { id: 2, side: 1, asset: 'TSLA', size: 12.2, lev: '14', pnl: '30.47' },
    { id: 3, side: 1, asset: 'TSLA', size: 33.8, lev: '7', pnl: '20.47' },
    { id: 4, side: -1, asset: 'TSLA', size: 2.5, lev: '2', pnl: '5.29' },
    { id: 5, side: -1, asset: 'TSLA', size: 0.5, lev: '19', pnl: '-50.99' },
];
interface Props {

}

const GlobalTrades: React.FC<Props> = () => {
    return (
        <div className='global-trades'>
            <Box sx={{ height: 390, width: '100%' }} >

                <h1 className='my-2'>Global Active Trades</h1>
                <DataGrid
                    autoHeight
                    columnHeaderHeight={40}
                    className='global-trades-table '
                    rows={rows}
                    columns={columns }
                    initialState={{
                        pagination: {

                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    // loading={true}
                    paginationMode="server"

                    disableRowSelectionOnClick
                />
            </Box>
        </div>
    );
}
export default GlobalTrades




