import { ConnectorCSV} from '../model/ConnectorCSV copy'

export interface Page {
    content: ConnectorCSV[],
    pageable: {
        sort: {
            empty: boolean,
            sorted: boolean,
            unsorted: boolean
        },
        offset: number,
        pageSize: number,
        pageNumber: number,
        unpaged: boolean,
        paged: boolean
    },
    last: boolean,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number,
    sort: {
        empty: boolean,
        sorted: boolean,
        unsorted: boolean
    },
    numberOfElements: number,
    first: boolean,
    empty: boolean
}
