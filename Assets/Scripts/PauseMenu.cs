using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PauseMenu : MonoBehaviour
{

    public GameObject Pausemenu;
    public GameObject PauseButton;

    public void Pause() 

    {
        Pausemenu.SetActive (true);  
        Time.timeScale = 0;
    }

    public void Resume() 
    {
        Pausemenu.SetActive (false);
        PauseButton.SetActive (true);
        Time.timeScale = 1;
    }

    public void Restart()
    {
        Application.LoadLevel(Application.loadedLevel);
    }

    public void MainMenu()
    {
        
    }

    public void Quit()
    {
        
    }

 


}
