<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\NewProductRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Services\ProductService;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(Category $category, ProductService $productService)
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

    public function search(Request $request)
    {
        $data = Product::where('title', 'LIKE', '%'.$request['search'].'%')
        ->orWhere('description', 'LIKE', '%'.$request['search'].'%')
        ->paginate(9);
        
        return response($data);
    }

    public function show(Product $product)
    {
        $data = $product;
        $data['images'] = $product->images;

        return response($data);
    }

    public function updateProduct(ProductUpdateRequest $request, Product $product, ProductService $productService)
    {
        try {
            $validated = $request->validated();
        } catch(ValidationException $e) {
            return response($e->errors());
        }

        $message = $productService->updateProduct($validated, $product);

        return response($message);
    }

    public function deleteProduct(Product $product)
    {
        $product->delete();

        return response('Product deleted successfully!');
    }

    public function createProduct(NewProductRequest $request, ProductService $productService) {
        try {
            $validated = $request->validated();
        } catch(ValidationException $e) {
            return response($e->errors());
        }

        $files = $request->file();
        if(count($files) == 0) {
            return response(['message' => 'Upload at least one image!'], 404);
        }

        $whiteList = ['jpeg', 'jpg', 'png'];
        $urls = [];
        foreach ($files as $file) {
            if(!in_array($file->guessExtension(), $whiteList)) {
                return response(['message' => 'File extension not supported!'], 406);
            }
            if($file->getSize() > 5242880) {
                return response(['message' => 'The file size exceeded the allowed 5mb'], 406);
            }

            $imageName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('images'), $imageName);

            $path = config('app.api_url') . "/images/" .  $imageName;
            array_push($urls, ['url' => $path]);
        }

        $product = Product::create([
            'title' => $validated['title'],
            'brand' => $validated['brand'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'description' => $validated['description'],
            'thumbnail' =>$urls[0]['url'],
        ]);

        $category = Category::updateOrCreate([
            'name' => $validated['category'],
        ]);

        $category->products()->attach($product);

        $product->images()->createMany($urls);

        $product['categories'] = $product->categories;
        $product['images'] = $product->images;

        return response($product, 201);
    }
}
