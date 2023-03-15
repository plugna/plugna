<?php

// Check that the file is not accessed directly.
if (!defined('ABSPATH')) {
    die('We\'re sorry, but you can not directly access this file.');
}


class PlugnaSettings
{
    protected $plugna = null;

    public function __construct($data = null)
    {
        $this->plugna = json_decode($data ? $data : get_option('plugna'));
        $this->firstTimeCheck();
        $this->settings()->feedbackStatus = $this->getFeedbackStatus();
    }

    protected function firstTimeCheck(){

        if(!isset($this->plugna)){
            $this->plugna = (object) [
                'settings' => (object)[
                    'firstRun' => time(),
                ]
            ];
            $this->persist();
        }
    }

    /**
     * Appends additional data to the settings object
     * @return array
     */
    public function appendJSON($json)
    {
        $settings = json_decode($json);
        foreach($settings as $key => $value) {
            $this->plugna->settings->{$key} = $value;
        }
    }

    public function getAll(){
        return json_encode($this->plugna);
    }

    protected function settings(){
        return $this->plugna->settings;
    }


    /*
     * '' - if the user has not yet seen the feedback form
     * 'show' - if the user has seen the feedback form
     * 'submitted' - if the user has submitted the feedback form
     *
     * Returns the feedback status
     * @return string
     */
    public function getFeedbackStatus(){

        if(isset($this->settings()->feedbackStatus)){
            return $this->settings()->feedbackStatus;
        }
        // 7 days to wait before showing the feedback form
        return (time() - $this->settings()->firstRun ) > 60 * 60 * 24 * 7 ? 'show' : '';
    }

    /**
     * Persists the settings to the database
     */
    public function persist(){
        update_option('plugna', json_encode($this->plugna));
    }
}