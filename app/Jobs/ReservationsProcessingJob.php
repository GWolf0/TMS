<?php

namespace App\Jobs;

use App\Models\TMSSystem;
use App\Services\ReservationsProcessingService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ReservationsProcessingJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected string $type)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("RPS Job started for type: {$this->type}");
        
            TMSSystem::getInstance()->is_processing_reservations = true;
            TMSSystem::getInstance()->save();

            ReservationsProcessingService::processReservations($this->type);
        } catch(Exception $ex) {
            Log::debug($ex);
        }finally {
            TMSSystem::getInstance()->is_processing_reservations = false;
            TMSSystem::getInstance()->save();

            Log::info("RPS Job completed for type: {$this->type}");
        }
    }

    // Getter
    public function getType() { return $this->type; }

}
