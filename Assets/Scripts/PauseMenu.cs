﻿
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;


public class PauseMenu : MonoBehaviour
{

   public GameObject Pausemenu;
   public GameObject ResumeButton;
   public GameObject PauseButton;
   public GameObject RestartButton;


    public void Pause() 
    {
        Pausemenu.SetActive (true); 
        PauseButton.SetActive (false); 
        RestartButton.SetActive (false); 
        FindObjectOfType<AudioManager>().Play("Pause");

         
        Time.timeScale = 0;
    }

    public void Resume() 
    {
        Pausemenu.SetActive (false);
        PauseButton.SetActive (true); 
        RestartButton.SetActive (true); 
        FindObjectOfType<AudioManager>().Play("Clicking Button");


        Time.timeScale = 1;
    }

    public void Restart()
    {
        Application.LoadLevel(Application.loadedLevel);
        FindObjectOfType<AudioManager>().Play("Clicking Button");

        Time.timeScale = 1;
    }

    public void MainMenu(int SceneIndex)
    {
        SceneManager.LoadScene(SceneIndex);
        FindObjectOfType<AudioManager>().Play("Clicking Button");

        
        Time.timeScale = 1;
    }
    public void Quit()
    {
        Application.Quit();
    }

    public void NextLevel()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
        FindObjectOfType<AudioManager>().Play("Clicking Button");
    
       
        Time.timeScale = 1;

    }

}