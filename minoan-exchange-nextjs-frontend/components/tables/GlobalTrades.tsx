'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { margin } from '@mui/system';

const columns: GridColDef[] = [

    {
        field: 'asset',
        headerName: 'Asset',
        width: 150,
        sortable: false,
        resizable:true,
    },
    {
        field: 'side',
        headerName: 'Side',
        type: 'number',
        width: 150,
        resizable:true,
    },
    {
        field: 'size',
        headerName: 'Position Size',
        type: 'number',
        width: 150,
        resizable:true,
    },
    {
        field: 'lev',
        headerName: 'Leverage',
        type: 'number',
        width: 100,
        resizable:true,
        valueFormatter: (params) =>
            `${(params.value, `${params.value}X`) || ''}`,

    },
    {
        field: 'pnl',
        headerName: 'PNL',
        width: 350,
        resizable:true,
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
        <Box sx={{ height: 390, width: '100%'  }} >

            <h1 className='my-2'>Global Trades</h1>
            <DataGrid
                className='global-trades-table'
                rows={rows}
                columns={columns}
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




