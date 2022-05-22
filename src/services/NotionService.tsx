import request from "axios";

class NotionService {

    static pageIdUrl = `https://notion-api-worker.atila.workers.dev/v1/page`;

    static getPageId = (pageId: any) => {

        const apiCompletionPromise = request({
            method: 'get',
            url: `${NotionService.pageIdUrl}/${pageId}`,
        });

        return apiCompletionPromise;
    };
}

export default NotionService;