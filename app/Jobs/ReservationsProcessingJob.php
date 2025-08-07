<?php

namespace App\Jobs;

use App\Services\ReservationsProcessingService;
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
        Log::info("RPS Job started for type: {$this->type}");
        ReservationsProcessingService::processReservations($this->type);
        Log::info("RPS Job completed for type: {$this->type}");
    }

    // Getter
    public function getType() { return $this->type; }

}
