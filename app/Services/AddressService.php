<?php

namespace App\Services;

use App\Exceptions\AddressException;
use App\Models\Address;
use App\Models\User;

class AddressService
{
  public function newAddress(array $validated, User $user): Address
  {
    $address = [
      'address' => $validated['address'],
      'country' => $validated['country'],
      'state' => isset($validated['state']) ? $validated['state'] : null,
      'city' => isset($validated['city']) ? $validated['city'] : null,
      'default' => false,
    ];

    $addressInDB = $user->addresses()->create($address);

    return $addressInDB;
  }

  public function changeDefault(User $user, Address $address): Address
  {
    $defaultAddress = $user->addresses()->where('default', 1)->first();
    $defaultAddress->default = 0;
    $defaultAddress->save();

    $address->default = 1;
    $address->save();

    return $address;
  }

  public function deleteAddress(Address $address): string
  {
    if($address->default == 1) 
      throw new AddressException('You cannot delete a default address!', 405);

    $address->delete();

    return 'Address deleted!';
  }
}