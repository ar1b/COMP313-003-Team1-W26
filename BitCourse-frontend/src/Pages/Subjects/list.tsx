import React from 'react'
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/ui/breadcrumb.tsx";

const SubjectsList = () => {
    return (
        <ListView>
            <Breadcrumb/>
            <h1 className="page-title">Subjects</h1>
        </ListView>
    )
}
export default SubjectsList
