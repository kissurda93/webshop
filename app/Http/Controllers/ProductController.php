<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\NewProductRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Services\ProductService;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(Category $category, ProductService $productService): Response
    {   
        if(isset($category->id)) {
            $data = $category->products()->paginate(9);
            return response($data);
        }

        $collection = $productService->productsOrderByCategories();

        //macro:'paginate' make it possible to call paginate() on Illuminate\Support\Collection. 
        // The macro is placed in AppServiceProvider
        $data = $collection->paginate(9);
        
        return response($data);
    }

    public function search(Request $request): Response
    {
        $data = Product::where('title', 'LIKE', '%'.$request['search'].'%')
        ->orWhere('description', 'LIKE', '%'.$request['search'].'%')
        ->paginate(9);
        
        return response($data);
    }

    public function show(Product $product): Response
    {
        $data = $product;
        $data['images'] = $product->images;

        return response($data);
    }

    public function updateProduct(ProductUpdateRequest $request, Product $product, ProductService $productService): Response
    {
        try {
            $validated = $request->validated();
        } catch(ValidationException $e) {
            return response($e->errors());
        }

        $message = $productService->updateProduct($validated, $product);

        return response($message);
    }

    public function deleteProduct(Product $product): Response
    {
        $product->delete();

        return response('Product deleted successfully!');
    }

    public function createProduct(NewProductRequest $request, ProductService $productService): Response
    {
        try {
            $validated = $request->validated();
        } catch(ValidationException $e) {
            return response($e->errors());
        }

        $product = $productService->createProduct($validated);
        $message = "Product created successfully!";
        
        return response(compact('product', 'message'), 201);
    }
}
