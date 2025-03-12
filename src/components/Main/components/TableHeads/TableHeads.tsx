import React, {useEffect, useState} from "react";

type TableHeadsPropsType = {
    sortUsers: (sd: string, f: string) => void,
    loading: boolean
}

type TableHeadsType = {
    id: string,
    sort: "asc"|"desc"|"none"|"disable",
    text: string
}

function TableHeads(props: TableHeadsPropsType){
    const [tableHeads, setTableHeads] = useState<TableHeadsType[]>([
        {
            id: "id",
            sort: "asc",
            text: "ID"
        },
        {
            id: "fio",
            sort: "none",
            text: "Фамилия Имя Отчество"
        },
        {
            id: "created",
            sort: "none",
            text: "Дата и время создания"
        },
        {
            id: "updated",
            sort: "none",
            text: "Последние изменения"
        },
        {
            id: "contacts",
            sort: "disable",
            text: "Контакты"
        },
        {
            id: "actions",
            sort: "disable",
            text: "Действия"
        },

    ]);
    useEffect(() => {
        if(!props.loading)
            setTableHeads([...tableHeads.map(item => {
                if(item.id === "id"){
                    return {
                        ...item,
                        sort: "asc" as TableHeadsType["sort"]
                    }
                }else{
                    return {
                        ...item,
                        sort: "none" as TableHeadsType["sort"]
                    }
                }
            })])
    }, [props.loading]);

    function sort(field: string): void{
        if(field === "contacts" || field === "actions") return;
        let sortDirection: TableHeadsType["sort"] = "none";
        setTableHeads([...tableHeads.map(item => {
            if(item.id === field){
                switch (item.sort){
                    case "asc":
                        sortDirection = "desc";
                        break;
                    case "desc":
                        sortDirection = "none"
                        break;
                    case "none":
                        sortDirection = "asc"
                        break;
                    default:
                        break;
                }
                return {
                    ...item,
                    sort: sortDirection as TableHeadsType["sort"]
                }
            }else{
                return {
                    ...item,
                    sort: "none" as TableHeadsType["sort"]
                }
            }
        })])
        props.sortUsers(sortDirection, field)
    }

    return(
        <tr>
            {tableHeads.map(head =>
                <th key={head.id} className={`head-column ${head.sort === "disable" && 'head-column-nosort'}`}>
                    <span onClick={()=>sort(head.id)}>
                        {head.text}
                        {head.sort === "asc" &&
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/>
                            </svg>
                        }
                        {head.sort === "desc" &&
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.7" clipPath="url(#clip0_221_919)">
                                    <path d="M10 6L9.295 5.295L6.5 8.085L6.5 2H5.5L5.5 8.085L2.71 5.29L2 6L6 10L10 6Z" fill="#9873FF"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_221_919">
                                        <rect width="12" height="12" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        }
                        {head.sort === "none" && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>}
                    </span>
                </th>
            )}
        </tr>
    );
}

export default TableHeads;