import { Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { BlockMapType, NotionRenderer } from "react-notion";
import NotionService from "../services/NotionService";

export interface NotionPageProps {
    pageId?: string;
    pageData?: BlockMapType;
    showTableOfContents: boolean;
    className: string;
}
NotionPage.defaultProps = {
  showTableOfContents: true,
  className: "",
}

const notionPageContentClassName = "NotionPage-content";
function NotionPage(props: NotionPageProps) {
  
  const { className } = props;
  const [loading, setLoading] = useState<string|undefined>(undefined);
  const [pageData, setPageData] = useState<BlockMapType|undefined>(props.pageData);

  const loadPageData = useCallback(
    () => {
        setLoading("Loading page information");
        NotionService.getPageId(props.pageId)
        .then((res: any) => {
            setPageData(res.data);
            
        })
        .catch( (err: any) => {
            console.log({err});
        })
        .then(()=> {
            setLoading(undefined);
        })
    },
    [props.pageId, props.showTableOfContents]
  );

  useEffect(() => {
    if (props.pageId) {
        loadPageData();
    }
  }, [loadPageData, props.pageId])
  
  
  return (
    
    <div className={`NotionPage ${className}`}>
        <div className={`${notionPageContentClassName}`}>
            {loading && <Spin tip={loading} />}
            {pageData && <NotionRenderer blockMap={pageData} />}
        </div>
    </div>
  )
}

export default NotionPage