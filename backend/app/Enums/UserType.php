<?php

namespace App\Enums;

enum UserType: string
{
    case PASSENGER = 'passenger';
    case DRIVER = 'driver';


    public function label(): string
    {
        return match($this) {
            self::PASSENGER => 'Passageiro',
            self::DRIVER => 'Motorista',
        };
    }
}
