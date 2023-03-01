<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\NewProductRequest;
use App\Http\Requests\ProductUpdateRequest;

class ProductController extends Controller
{
    public function index(Category $category)
    {   
        if(isset($category->id)) {
            $data = $category->products()->paginate(9);
            return response($data);
        }
        
        $data = Product::paginate(9);
        return response($data);
    }

    public function search(Request $request) {
        $data = Product::where('title', 'LIKE', '%'.$request['search'].'%')
        ->orWhere('description', 'LIKE', '%'.$request['search'].'%')
        ->paginate(9);
        
        return response(compact('data'));
    }

    public function show($id)
    {
        $product = Product::with('images')->find($id);
        
        return response($product);
    }

    public function updateProduct(ProductUpdateRequest $request) {

        $validated = $request->validated();
        $product = Product::find($validated['id']);
        if(!$product)
            return response(['message' => 'Product not find'], 404);

        if($product['stock'] != $validated['stock'])
            $product->update(['stock' => $validated['stock']]);

        if($product['discountPercentage'] != $validated['discount'])
            $product->update(['discountPercentage' => $validated['discount']]);

        return response(['message' => 'Product updated successfully!']);
    }

    public function deleteProduct($id) {

        Product::find($id)->delete();
        return response([]);
    }

    public function createProduct(NewProductRequest $request) {
        $validated = $request->validated();

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
            $file->move(storage_path('app/public'), $imageName);

            $path = public_path('storage') . '/' .  $imageName;
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

        return response($product);
    }
}
