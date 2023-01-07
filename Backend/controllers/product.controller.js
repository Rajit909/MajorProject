import Product from '../models/productSchema'
import formidable from 'formidable'
import fs from "fs"
import {deleteFile, s3FileUpload} from '../services/imageUpload'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'
import { Mongoose } from 'mongoose'
import config from '../config/index'


/******************************************************
 * @upload image
 * @route http://localhost:5000/api/collection
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/



export const addProduct = asyncHandler(async (req, res) =>{
    const form = formidable({
        multiples: true,
        keepExtensions: true,
    });

    form.parse(req, async function(err, fields, files){
        try {
            if (err) {
                throw new CustomError(err.message || "Something went wrong",500)
            }

            let productId = new Mongoose.Types.ObjectId().toHexString()
            // console.log(fields, files)

            // check for fields

            if (!fields.name || !fields.price || !fields.description || !fields.collectionId) {
                if (err) {
                    throw new CustomError("Please fill all the details",500)
                }
            }

            // handle images

            let imgArrayResp = Promise.all(
                Object.keys(files).map(async (filekey, index) => {
                    const element = files[filekey]

                    const data = fs.readFile(element.filepath)

                    const upload = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `product/${productId}/photo_${index + 1}.png`,
                        body: data,
                        contentType: element.mimetype
                    })
                    return {
                        secure_url: upload.Location
                    }
                })
            )


            let imgArray = await imgArrayResp;

            const product = await Product.create({
                _id: productId,
                photos: imgArray,
                ...fields,
                
            })

            if (!product) {
                if (err) {
                    throw new CustomError("Product was not created",400)
                }
            }
            
            res.status(200).json({
                success: true,
                product
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Something went wrong"
            })
        }
    })
})

/******************************************************
 * @Create_collection
 * @route http://localhost:5000/api/collection
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/

export const getAllProducts = asyncHandler( async(req,res)=>{
    const products = await Product.find({})

    if (!products) {
        throw new CustomError("No products was found",404)
    }

    res.status(200).json({
        success:true,
        products
    })
})


export const getProductById = asyncHandler( async(req,res)=>{
    const {id: productId} = req.params
    
    const product = await Product.findById(productId)

    if (!product) {
        throw new CustomError("No product was found",404)
    }

    res.status(200).json({
        success:true,
        product
    })
})


