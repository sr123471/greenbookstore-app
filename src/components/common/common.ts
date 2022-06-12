export interface Academy {
    _id: string;
    academyName: string;
    schoolName: string;
}

export interface Major {
    _id: string;
    majorName: string;
    academyName: string;
    schoolName: string;
}

export interface Exam {
    _id: string;
    examName: string;
    schoolName: string;
}

export interface Book {
    //书本id
    _id: string;
    //书本ISBN编号
    ISBN: string;
    //书本名称
    bookName: string;
    //书本作者
    author: string;
    //书本照片
    imgURL: string;
    //书本出版社
    press: string;
    //书本出版时间
    publishTime: string;
    //书本原价
    originalPrice: number;
    //书本现价
    presentPrice: number;
    //书本库存
    stock: number;
    //书本销量
    salesVolume: number;
    //用于购物车，记录用户是否选中该商品，初始为false
    isSelect: boolean;
    //用于购物车，记录用户选择商品的数量，初始为1
    selectQuantity: number;
    //书本类型
    bookType: 'publicBook' | 'majorBook' | 'examBook' | 'novelBook';
    //书本所属的学校
    schoolName: string;
    //如果书本是专业课书籍，书本所属的学院
    academy?: string;
    //如果书本是专业课书籍，书本所属的专业
    major?: string;
    //如果书本是考试书籍，则所属的考试名称
    exam?: string;
}